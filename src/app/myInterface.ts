import { CalendarEvent } from 'angular-calendar';

export interface someEvent extends CalendarEvent {
  meetingId: string;
  description: string;
}