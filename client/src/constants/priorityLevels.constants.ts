import { Priority } from "../models/priority.model";

export const PRIORITY_LEVELS: Priority[] = [
  {
    order: 0,
    displayText: 'Do it for yesterday!',
    displayColor: '#fa0000',
    isDefaultSelected: false,
  },
  {
    order: 1,
    displayText: 'Urgent... please... pleeeeeeeeeeease',
    displayColor: '#fa6800',
    isDefaultSelected: false,
  },
  {
    order: 2,
    displayText: 'It is needed to be done, you should put on a task list or in a postit (I recommend the second one)',
    displayColor: '#0079fa',
    isDefaultSelected: false,
  },
  {
    order: 3,
    displayText: 'A friendly reminder',
    displayColor: '#17bd2d',
    isDefaultSelected: true,
  },
  {
    order: 4,
    displayText: `Do it whenever you want, I'm not asking for it anymore, you'll see, so...`,
    displayColor: '#949494',
    isDefaultSelected: false,
  },
];

const PRIORITY_LEVEL_NAMES = PRIORITY_LEVELS.map((priorityLevel) => priorityLevel.displayText);
export type PRIORITY_LEVEL_TYPE = typeof PRIORITY_LEVEL_NAMES[number];

const PRIORITY_ORDERS = PRIORITY_LEVELS.map((priorityLevel) => priorityLevel.order);
export type PRIORITY_ORDER_TYPE = typeof PRIORITY_ORDERS[number];