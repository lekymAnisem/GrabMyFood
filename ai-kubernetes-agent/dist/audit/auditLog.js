export class AuditLog {
    logger;
    records = [];
    constructor(logger) {
        this.logger = logger;
    }
    write(record) {
        const entry = { ...record, timestamp: new Date().toISOString() };
        this.records.push(entry);
        this.logger.info({ audit: sanitize(entry) }, "audit record written");
        return entry;
    }
    list() {
        return [...this.records];
    }
}
function sanitize(value) {
    return JSON.parse(JSON.stringify(value, (key, item) => {
        if (/secret|token|password|credential|authorization/i.test(key))
            return "[redacted]";
        return item;
    }));
}
