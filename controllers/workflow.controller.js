import dayjs from 'dayjs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express'); // Upstash written in common.js  
import Subscription from '../models/subscription.model.js';

const REMINDERS = [7, 5, 2, 1]; // Reminder days before renewal date

// Workflow to send reminders
export const sendReminders = serve(async (context) => {
    const { subscriptionId } = context.requestPayload;

    // Fetch the subscription
    const subscription = await fetchSubscription(context, subscriptionId);
    console.log(`Fetched subscription: ${subscriptionId}`); // Check if the subscription is being fetched

    if (!subscription || subscription.status !== "active") return;

    const renewalDate = dayjs(subscription.renewalDate);

    if (renewalDate.isBefore(dayjs())) {
        console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
        return;
    }

    for (const daysBefore of REMINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');
        console.log(`Reminder date: ${reminderDate.toString()}`);
    
        if (reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
        }
    
        await triggerReminder(context, `Reminder ${daysBefore} days before`, subscription); // Pass subscription here
    }
  
});

// Fetch subscription from the database using the subscription ID
const fetchSubscription = async (context, subscriptionId) => {
  return await context.run('get subscription', async () => {
    return Subscription.findById(subscriptionId).populate('user', 'name email');
  });
};

// Sleep until the reminder date
const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label} reminder at ${date}`);
  await context.sleepUntil(label, date.toDate());
};

// Trigger the reminder action (e.g., send an email, SMS, etc.)
const triggerReminder = async (context, label, subscription) => {
  if (!subscription) {
      console.error(`Error: Subscription is undefined in ${label}`);
      return;
  }

  return await context.run(label, () => {
      console.log(`Triggering ${label} reminder for subscription: ${subscription.name}`);
  });
};
