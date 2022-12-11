# SKWL NOTES

# NODE VERSION
node -v (12.22.9)

ORM used is [TypeORM](https://typeorm.io/#/)

DATABASE used is [MySQL2](https://github.com/sidorares/node-mysql2#readme)

## ENVIRONMENT

env variables should be configured in root `.env` file:

```
// app port and running mode: <development | production>
PORT=3000
NODE_ENV=development

// database settings
DB_PORT=3000
DB_HOST=localhost
DB_USERNAME=admin
DB_PASSWORD=secret

```

## ENTITIES
- admin
  - id: number;
  - login: string;
  - password: string;
- chats
  - id: number;
  - creator: User; user in this chat
  - companion: User; user in this chat
  - messages: Message[];
- comment
  - id: number;
  - content: string; comment text
  - postId: number; id of post which was commented
  - postType: post_types; cna be video or product
  - createdAt: Date;
  - updatedAt: Date;
- marketplace_saved
  - id: number;
  - user: User;
  - marketplace: MarketPlace; link to product
- marketplace  the product 
  - id: number;
  - image_link: string;
  - title: string;
  - link: string; link to website which sells this product
  - price: string;
  - status: marketplace_product_status; 'published','draft'
  - created_at: Date;
  - user: User;
- messages
  - id: number;
  - message: string;
  - created_at: Date;
  - author: User;
- notifications
  - id: number;
  - type: notifications_types; 'comment','like','follow','new_message'
  - message: string;
  - isActive: boolean; 
  - user: User;
  - eventId: number; if message messageId, if comment commentId ...
  - createdAt: Date;
  - parent: Notification; only for like notification. previous like notification for this product is saved as parent
- notification_setting
  - id: number;
  - user: User;
  - following: boolean; if true, user will receive notifications from users he follows
  - message: boolean; if true, user will receive notifications from messages
  - likes: boolean; if true, user will receive notifications from likes
- saved_videos
  - id: number;
  - user: User; user who saved this video
  - video: Video; video which was saved
- subscription
  - id: number;
  - user: User;
  - environment: string;  'testing' or 'production'
  - orig_tx_id: string; original transaction id
  - latest_receipt: string; latest receipt for subscription get from iap validation
  - start_date: Date;
  - end_date: Date;
  - app: string; 'ios' or 'android'
  - product_id: string;
  - is_cancelled: boolean;
  - validation_response: string; response from iap validation
- user_device
  - id: number;
  - user: User;
  - deviceId: string; 
  - deviceName: string;
  - deviceUniqueId: string; 
  - brand: string; phone brand
  - token: string; fcmToken
- user_followers
  - id: number;
  - user: User; 
  - follower: User; 
- user_videos
  - id: number;
  - user: User;
  - video: Video;
- users
  - id: number;
  - user_id: string;
  - first_name: string;
  - second_name: string;
  - username: string;
  - email: string;
  - avatar: string;
  - header: string;
  - description: string;
  - website_link: string;
  - background_image: string;
  - plan: plans_types.NON | plans_types.BASE | null;
  - plan_end_date: Date | null;
  - is_blocked: boolean;
  - notificationSetting: NotificationSetting; which type of notifications user wants to receive
- videos_likes
  - id: number;
  - user: User;
  - video: Video;
- videos
  - id: number;
  - link: string;
  - title: string;
  - product_title: string; the product about which is the video
  - product_image_link: string;
  - product_link: string;
  - price: string;
  - hashtag: string;
  - isTranding: boolean;
  - likes: number; amount of likes
  - created_at: Date;
  - user: User;

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Running lint

$ npm run lint
$ npm run lint --fix

````

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
````

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
