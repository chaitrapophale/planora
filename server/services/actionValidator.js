/**
 * Planora Action Proposal Validator
 * Ensures that all AI-generated actions conform to strict schemas and safe bounds
 * before sending to client for organizer preview and approval.
 */

export const ALLOWED_ACTION_TYPES = [
  'create_task',
  'update_task',
  'create_expense',
  'update_expense',
  'create_supply',
  'update_supply',
  'create_food_item',
  'create_schedule_activity',
  'update_schedule_activity',
  'update_event'
];

export function validateProposedAction(action) {
  if (!action || typeof action !== 'object') {
    return { isValid: false, error: 'Action must be an object' };
  }

  const { type, data } = action;

  if (!ALLOWED_ACTION_TYPES.includes(type)) {
    return {
      isValid: false,
      error: `Disallowed action type "${type}". Permitted: ${ALLOWED_ACTION_TYPES.join(', ')}`
    };
  }

  if (!data || typeof data !== 'object') {
    return { isValid: false, error: 'Action data payload is required' };
  }

  // Type-specific field validations
  switch (type) {
    case 'create_task': {
      if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
        return { isValid: false, error: 'Task title is required' };
      }
      const validPriorities = ['critical', 'high', 'medium', 'low'];
      const priority = (data.priority || 'medium').toLowerCase();
      data.priority = validPriorities.includes(priority) ? priority : 'medium';
      data.title = data.title.trim().slice(0, 150);
      data.description = (data.description || '').slice(0, 500);
      data.category = data.category || 'General';
      data.assignedTo = data.assignedTo || 'Unassigned';
      break;
    }

    case 'update_task': {
      if (!data.taskId) {
        return { isValid: false, error: 'Target taskId is required for update' };
      }
      break;
    }

    case 'create_expense': {
      if (!data.title || typeof data.title !== 'string') {
        return { isValid: false, error: 'Expense title is required' };
      }
      const amount = Number(data.amount);
      if (isNaN(amount) || amount <= 0) {
        return { isValid: false, error: 'Valid positive expense amount is required' };
      }
      data.amount = Math.round(amount);
      data.category = data.category || 'General';
      data.status = data.status || 'Pending Approval';
      data.vendor = data.vendor || 'Proposed Vendor';
      break;
    }

    case 'update_expense': {
      if (!data.expenseId) {
        return { isValid: false, error: 'Target expenseId is required for update' };
      }
      break;
    }

    case 'create_supply': {
      if (!data.name || typeof data.name !== 'string') {
        return { isValid: false, error: 'Supply item name is required' };
      }
      data.name = data.name.trim().slice(0, 120);
      data.requiredQty = Math.max(1, Number(data.requiredQty) || 1);
      data.availableQty = Math.max(0, Number(data.availableQty) || 0);
      data.estimatedCost = Math.max(0, Number(data.estimatedCost) || 0);
      data.unit = data.unit || 'units';
      data.category = data.category || 'General Equipment';
      break;
    }

    case 'update_supply': {
      if (!data.supplyId) {
        return { isValid: false, error: 'Target supplyId is required for update' };
      }
      break;
    }

    case 'create_food_item': {
      if (!data.mealType || typeof data.mealType !== 'string') {
        return { isValid: false, error: 'Meal type is required' };
      }
      data.paxCount = Math.max(1, Number(data.paxCount) || 100);
      data.costPerPax = Math.max(0, Number(data.costPerPax) || 50);
      data.menuItems = Array.isArray(data.menuItems) 
        ? data.menuItems 
        : (data.menuItems ? [data.menuItems] : ['Meal package']);
      break;
    }

    case 'create_schedule_activity': {
      if (!data.activityName || typeof data.activityName !== 'string') {
        return { isValid: false, error: 'Activity name is required' };
      }
      data.scheduledTime = data.scheduledTime || '10:00';
      data.stage = data.stage || data.zone || 'Main Stage';
      break;
    }

    case 'update_schedule_activity': {
      if (!data.activityId) {
        return { isValid: false, error: 'Target activityId is required for update' };
      }
      break;
    }

    case 'update_event': {
      if (data.budget !== undefined) {
        data.budget = Math.max(1000, Number(data.budget) || 100000);
      }
      if (data.attendance !== undefined) {
        data.attendance = Math.max(1, Number(data.attendance) || 100);
      }
      break;
    }
  }

  return { isValid: true, sanitizedAction: action };
}
