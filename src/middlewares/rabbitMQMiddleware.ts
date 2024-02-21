import { NextFunction } from 'express';
import RabbitMQSetup from '../components/messageBroker';
import { RabbitMQExchangeNameEnum, RabbitMQQueueNameEnum, RabbitMQRoutingKeyEnum } from '../types/custom/enum';

export async function initializeRabbitMQ() {
  try {
    // Set up RabbitMQ
    const rabbitMQSetup = new RabbitMQSetup();
    const channel = await rabbitMQSetup.setup();

    // Create queues
    await rabbitMQSetup.createQueue(RabbitMQQueueNameEnum.trip_queue, RabbitMQRoutingKeyEnum.trip_routing_key);
    // await rabbitMQSetup.createQueue(RabbitMQQueueNameEnum.passenger_queue, RabbitMQRoutingKeyEnum.passenger_routing_key);
    //...

    // Consume messages
    await rabbitMQSetup.consumeMessage(RabbitMQQueueNameEnum.trip_queue, (message) => {
      // Handle received message here
      const data = JSON.parse(message.content.toString());
      console.log('Received message from trip_queue:  ', data);
    });
    //   await rabbitMQSetup.consumeMessage(RabbitMQQueueNameEnum.passenger_queue, (message) => {
    //     console.log('Received message from passenger_queue:  ', message.content.toString());
    //   });

    console.log('RabbitMQ setup completed successfully.');
  } catch (error) {
    console.error('Error setting up RabbitMQ:', error);
  }
}
