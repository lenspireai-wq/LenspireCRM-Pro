const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const QUEUE_FILE = path.join(process.env.LENSPIRE_DB_PATH || './src/database', 'offline-queue.json');
const MAX_QUEUE_SIZE = 100;
const MAX_RETRIES = 3;

class OfflineQueue {
    constructor() {
        this.queue = [];
        this.isProcessing = false;
        this.load();
    }

    load() {
        try {
            if (fs.existsSync(QUEUE_FILE)) {
                const data = JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8'));
                this.queue = data.queue || [];
                console.log(`[OfflineQueue] Loaded ${this.queue.length} queued operations`);
            }
        } catch (error) {
            console.error('[OfflineQueue] Failed to load queue:', error.message);
            this.queue = [];
        }
    }

    save() {
        try {
            fs.writeFileSync(QUEUE_FILE, JSON.stringify({ queue: this.queue }, null, 2), 'utf8');
        } catch (error) {
            console.error('[OfflineQueue] Failed to save queue:', error.message);
        }
    }

    enqueue(type, data, metadata = {}) {
        if (this.queue.length >= MAX_QUEUE_SIZE) {
            console.warn('[OfflineQueue] Queue full, removing oldest entry');
            this.queue.shift();
        }

        const operation = {
            id: crypto.randomUUID(),
            type,
            data,
            metadata: {
                ...metadata,
                createdAt: new Date().toISOString(),
                retries: 0,
                lastError: null
            }
        };

        this.queue.push(operation);
        this.save();
        console.log(`[OfflineQueue] Enqueued ${type} operation (${operation.id})`);
        
        return operation.id;
    }

    dequeue(id) {
        const index = this.queue.findIndex(op => op.id === id);
        if (index !== -1) {
            this.queue.splice(index, 1);
            this.save();
            console.log(`[OfflineQueue] Removed operation ${id}`);
        }
    }

    markRetry(id, error) {
        const operation = this.queue.find(op => op.id === id);
        if (operation) {
            operation.metadata.retries++;
            operation.metadata.lastError = error?.message || String(error);
            operation.metadata.lastRetryAt = new Date().toISOString();
            this.save();
        }
    }

    getPending() {
        return this.queue.filter(op => op.metadata.retries < MAX_RETRIES);
    }

    getFailed() {
        return this.queue.filter(op => op.metadata.retries >= MAX_RETRIES);
    }

    clear() {
        this.queue = [];
        this.save();
        console.log('[OfflineQueue] Queue cleared');
    }

    async processQueue(cloudApi) {
        if (this.isProcessing) {
            console.log('[OfflineQueue] Already processing, skipping');
            return { processed: 0, failed: 0 };
        }

        this.isProcessing = true;
        let processed = 0;
        let failed = 0;

        const pending = this.getPending();
        console.log(`[OfflineQueue] Processing ${pending.length} pending operations`);

        for (const operation of pending) {
            try {
                await this.processOperation(operation, cloudApi);
                this.dequeue(operation.id);
                processed++;
                console.log(`[OfflineQueue] ✓ Processed ${operation.type} (${operation.id})`);
            } catch (error) {
                this.markRetry(operation.id, error);
                failed++;
                console.error(`[OfflineQueue] ✗ Failed ${operation.type} (${operation.id}):`, error.message);
                
                if (operation.metadata.retries >= MAX_RETRIES) {
                    console.error(`[OfflineQueue] Operation ${operation.id} exceeded max retries, marking as failed`);
                }
            }
        }

        this.isProcessing = false;
        return { processed, failed, remaining: this.queue.length };
    }

    async processOperation(operation, cloudApi) {
        const { type, data } = operation;

        switch (type) {
            case 'create_lead':
            case 'update_lead':
                return await cloudApi.request('POST', '/leads/', data);
            
            case 'create_event':
            case 'update_event':
                return await cloudApi.request('POST', '/events/', data);
            
            case 'create_payment':
            case 'update_payment':
                return await cloudApi.request('POST', '/payments/', data);
            
            case 'create_production_job':
                return await cloudApi.request('POST', '/production-jobs/', data);
            
            case 'update_production_status':
                return await cloudApi.request('PATCH', `/production-jobs/${data.id}/`, data.updates);
            
            default:
                throw new Error(`Unknown operation type: ${type}`);
        }
    }

    getStatus() {
        return {
            total: this.queue.length,
            pending: this.getPending().length,
            failed: this.getFailed().length,
            oldestPending: this.queue.length > 0 ? this.queue[0].metadata.createdAt : null
        };
    }
}

const offlineQueue = new OfflineQueue();

module.exports = { 
    offlineQueue,
    OfflineQueue 
};
