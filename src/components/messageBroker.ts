import * as amqp from 'amqplib';
import { RabbitMQExchangeNameEnum, RabbitMQQueueNameEnum, RabbitMQRoutingKeyEnum } from '../types/custom/enum';
import { config } from '../config';

class RabbitMQSetup {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  constructor(private exchangeName: RabbitMQExchangeNameEnum = RabbitMQExchangeNameEnum.trip) {}

  async setup(): Promise<amqp.Channel> {
    try {
      this.connection = await amqp.connect(config.rabbitMQ.url);
      this.channel = await this.connection.createChannel();

      await this.channel.assertExchange(this.exchangeName, 'direct', { durable: true });

      console.info('--------------- Connected to RabbitMQ ---------------');

      return this.channel;
    } catch (error) {
      console.error('Error connecting to RabbitMQ', error);
      throw error;
    }
  }

  async createQueue(queueName: string, routingKey: string): Promise<void> {
    try {
      if (!this.channel) {
        throw new Error('Channel is not initialized. Call setup() first.');
      }

      await this.channel.assertQueue(queueName, { durable: true });
      await this.channel.bindQueue(queueName, this.exchangeName, routingKey);
    } catch (error) {
      console.error('Error creating queue in RabbitMQ', error);
      throw error;
    }
  }

  async sendMessage(
    channel = this.channel,
    exchangeName: RabbitMQExchangeNameEnum = RabbitMQExchangeNameEnum.trip,
    routingKey: RabbitMQRoutingKeyEnum,
    message: Record<string, any>
  ) {
    try {
      if (!channel) {
        throw new Error('Channel is not provided.');
      }
      channel.publish(exchangeName, routingKey, Buffer.from(JSON.stringify(message)));
      console.log('Message sent to RabbitMQ:', message);
    } catch (error) {
      console.error('Error sending message to RabbitMQ', error);
      throw error;
    }
  }

  async consumeMessage(queueName: RabbitMQQueueNameEnum, callback: (message: amqp.Message) => void): Promise<void> {
    try {
      if (!this.channel) {
        throw new Error('Channel is not initialized. Call setup() first.');
      }

      await this.channel.assertQueue(queueName, { durable: true });
      await this.channel.consume(queueName, (message) => {
        if (message !== null) {
          console.log('Received message from RabbitMQ:', message.content.toString());
          callback(message); // Pass the message to the callback function
        }
      });
    } catch (error) {
      console.error('Error consuming message from RabbitMQ', error);
      throw error;
    }
  }
}

export default RabbitMQSetup;
