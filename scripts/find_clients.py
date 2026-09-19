import sqlite3
import sys
import os

DB_PATH = os.path.join('backend','db.sqlite3')
TERMS = ['8108730107','Ashlesha Kamble','C-106C0658','C-4D88B00A']

if not os.path.exists(DB_PATH):
    print(f"Database not found at {DB_PATH}")
    sys.exit(1)

con = sqlite3.connect(DB_PATH)
con.row_factory = sqlite3.Row
cur = con.cursor()

# Find tables
cur.execute("SELECT name, sql FROM sqlite_master WHERE type='table'")
Tables = cur.fetchall()

print(f"Found {len(Tables)} tables in {DB_PATH}\n")

matches = []

for t in Tables:
    tname = t['name']
    try:
        cur.execute(f"PRAGMA table_info('{tname}')")
        cols = [r['name'] for r in cur.fetchall()]
    except Exception as e:
        continue
    text_cols = cols
    where_clauses = []
    for col in text_cols:
        for term in TERMS:
            where_clauses.append(f"{col} LIKE '%{term.replace("'", "''")}%'")
    if not where_clauses:
        continue
    query = f"SELECT rowid, * FROM '{tname}' WHERE " + " OR ".join(where_clauses) + " LIMIT 100"
    try:
        cur.execute(query)
        rows = cur.fetchall()
    except Exception:
        rows = []
    if rows:
        for r in rows:
            matches.append((tname, dict(r)))

if not matches:
    print("No matching rows found for the search terms.")
else:
    print("Matches found:\n")
    for tbl, row in matches:
        print(f"Table: {tbl}")
        for k,v in row.items():
            print(f"  {k}: {v}")
        print('')

# Additionally, check tables with 'lead' in name for foreign links
lead_tables = [t['name'] for t in Tables if 'lead' in t['name'].lower()]
print(f"Lead-like tables: {lead_tables}\n")

linked = []
for lt in lead_tables:
    try:
        cur.execute(f"PRAGMA table_info('{lt}')")
        cols = [r['name'] for r in cur.fetchall()]
    except Exception:
        continue
    # search all columns for client IDs or phone
    where_clauses = []
    for col in cols:
        for term in TERMS:
            where_clauses.append(f"{col} LIKE '%{term.replace("'", "''")}%'")
    if not where_clauses:
        continue
    q = f"SELECT rowid, * FROM '{lt}' WHERE " + " OR ".join(where_clauses) + " LIMIT 100"
    try:
        cur.execute(q)
        rows = cur.fetchall()
    except Exception:
        rows = []
    if rows:
        for r in rows:
            linked.append((lt, dict(r)))

if not linked:
    print("No links to lead-like tables found for these terms.")
else:
    print("Links in lead-like tables:\n")
    for lt, row in linked:
        print(f"Lead Table: {lt}")
        for k,v in row.items():
            print(f"  {k}: {v}")
        print('')

con.close()
