import { FlowEventPayload } from './flow-event.emitter';

export interface FlowEventProcessor {
  process: (flowEventPayload: FlowEventPayload) => Promise<void>;
}
