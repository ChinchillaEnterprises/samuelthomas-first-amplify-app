import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Product: a
    .model({
      name: a.string().required(),
      description: a.string(),
      price: a.float().required(),
      category: a.string().required(),
      imageUrl: a.string(),
      inStock: a.boolean().default(true),
      stockQuantity: a.integer().default(0),
      discount: a.float().default(0),
      featured: a.boolean().default(false),
      tags: a.string().array(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [allow.guest().to(['read']), allow.owner().to(['create', 'update', 'delete'])]),
  
  Category: a
    .model({
      name: a.string().required(),
      description: a.string(),
      imageUrl: a.string(),
      parentCategoryId: a.id(),
    })
    .authorization((allow) => [allow.guest().to(['read']), allow.owner().to(['create', 'update', 'delete'])]),
  
  UserProfile: a
    .model({
      firstName: a.string(),
      lastName: a.string(),
      email: a.email(),
      phone: a.string(),
      address: a.string(),
      city: a.string(),
      state: a.string(),
      zipCode: a.string(),
      country: a.string().default('US'),
    })
    .authorization((allow) => allow.owner()),
  
  Order: a
    .model({
      totalAmount: a.float().required(),
      status: a.string().required(),
      shippingAddress: a.string(),
      billingAddress: a.string(),
      orderDate: a.datetime(),
      shippedDate: a.datetime(),
      deliveredDate: a.datetime(),
    })
    .authorization((allow) => allow.owner()),
  
  OrderItem: a
    .model({
      orderId: a.id().required(),
      productId: a.id().required(),
      quantity: a.integer().required(),
      price: a.float().required(),
    })
    .authorization((allow) => allow.owner()),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});