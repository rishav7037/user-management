import * as crypto from 'crypto';

export class LoggerData {
    correlationId: string;
    flowName: string;
  
    constructor(
        flowName: string) {
        this.flowName = flowName;
      }

    setCorrelationId(correlationId : string) {
        this.correlationId = correlationId;
    }

    toJson(): string {
        return JSON.stringify(this);
    }

  getCorrelationId(): string {
    return this.correlationId;
  }

  generateCorrelationId(correlationId?: Object) {
    this.correlationId = typeof correlationId !== 'undefined' ? correlationId.toString() : crypto.randomUUID();
  }
}
