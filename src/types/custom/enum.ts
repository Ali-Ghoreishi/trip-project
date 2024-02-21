export enum StaticRoleEnum {
  Admin = 'Admin',
  Driver = 'Driver'
}

export enum StatusEnum {
  active = 'active',
  deactive = 'deactive',
  blocked = 'blocked'
}

export enum RabbitMQExchangeNameEnum {
  trip = 'trip'
}

export enum RabbitMQQueueNameEnum {
  trip_queue = 'trip_queue'
}

export enum RabbitMQRoutingKeyEnum {
  trip_routing_key = 'trip_routing_key'
}
