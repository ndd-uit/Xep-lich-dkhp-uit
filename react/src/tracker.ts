import { log } from './utils';

type AllowedPropertyValues = string | number | boolean | null | undefined;
type EventGroup = 'tkb_table' | 'so_tc' | 'drawer' | 'page1' | 'page2' | 'page3' | 'page';
type EventName = `[${EventGroup}] ${string}`;

/**
 * Retains the UI tracking API without sending activity to the original
 * project's third-party analytics services.
 */
export const buildTracker = () => {
  const track = (eventName: EventName, properties?: Record<string, AllowedPropertyValues>) => {
    log('>>track', eventName, properties);
  };

  const updateProperty = (_key: string, _value: AllowedPropertyValues) => undefined;

  return { track, updateProperty };
};
