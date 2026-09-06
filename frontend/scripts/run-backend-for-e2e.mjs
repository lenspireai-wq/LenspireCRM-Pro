import { spawn, spawnSync } from "node:child_process";
import { copyFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

const projectPython = process.platform === "win32"
  ? resolve("../.venv/Scripts/python.exe")
  : resolve("../.venv/bin/python");
const python = existsSync(projectPython) ? projectPython : process.platform === "win32" ? "python" : "python3";
const sourceDatabase = resolve("../backend/db.sqlite3");
const testDatabase = resolve(tmpdir(), `lenspire-e2e-${process.pid}.sqlite3`);
const testBackupDirectory = resolve(tmpdir(), `lenspire-e2e-backups-${process.pid}`);
if (existsSync(sourceDatabase)) copyFileSync(sourceDatabase, testDatabase);

const environment = {
  ...process.env,
  POSTGRES_DB: "",
  SQLITE_NAME: testDatabase,
  BACKUP_ROOT: testBackupDirectory,
  DEBUG: "true",
  SECURE_SSL_REDIRECT: "false",
  BACKUP_ENCRYPTION_KEY: "e2e-only-backup-encryption-key",
};

const migrated = spawnSync(python, ["../backend/manage.py", "migrate", "--noinput"], { stdio: "inherit", env: environment });
if (migrated.status !== 0) {
  rmSync(testDatabase, { force: true });
  process.exit(migrated.status ?? 1);
}

const seeded = spawnSync(
  python,
  [
    "../backend/manage.py",
    "shell",
    "-c",
    "from apps.core.models import Organization; from apps.users.models import User,UserAuditActivity; org,_=Organization.objects.get_or_create(slug='e2e-studio', defaults={'name':'E2E Studio'}); user,_=User.objects.get_or_create(username='admin', defaults={'organization':org,'is_staff':True,'is_superuser':True}); user.organization=org; user.is_staff=True; user.is_superuser=True; user.set_password('admin123'); user.save(); UserAuditActivity.objects.get_or_create(organization=org, target_user=user, target_name='audit_test', action='created', description='audit_test seed record', performed_by='audit_test')",
  ],
  { stdio: "inherit", env: environment },
);
if (seeded.status !== 0) {
  rmSync(testDatabase, { force: true });
  process.exit(seeded.status ?? 1);
}

const child = spawn(python, ["../backend/manage.py", "runserver", "127.0.0.1:8000", "--noreload"], { stdio: "inherit", env: environment });
const cleanup = () => {
  rmSync(testDatabase, { force: true });
  rmSync(testBackupDirectory, { recursive: true, force: true });
};
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    child.kill(signal);
    cleanup();
  });
}
child.on("exit", (code) => {
  cleanup();
  process.exit(code ?? 1);
});
