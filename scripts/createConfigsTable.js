const AWS = require('aws-sdk');

AWS.config.update({
	dynamodb: {
		endpoint: new AWS.Endpoint(process.env['AWS_ENDPOINT']),
		region: 'ru-central1-a'
	},
	accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
	secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY']
});

const configsTableName = 'configs';

const createConfigsTable = () => {
	return new Promise((resolve, reject) => {
		const dynamodb = new AWS.DynamoDB();
		dynamodb.createTable(
			{
				AttributeDefinitions: [
					{ AttributeName: 'vk_group_id', AttributeType: 'S' },
					{ AttributeName: 'vk_group_callback', AttributeType: 'S' },
					{ AttributeName: 'vk_last_post_id', AttributeType: 'S' },
					{ AttributeName: 'name', AttributeType: 'S' },
					{ AttributeName: 'tg_token', AttributeType: 'S' },
					{ AttributeName: 'tg_chat_id', AttributeType: 'S' }
				],
				TableName: configsTableName,
				KeySchema: [{ AttributeName: 'vk_group_id', KeyType: 'HASH' }],
				BillingMode: 'PAY_PER_REQUEST'
			},
			function (err, data) {
				if (err) {
					if (err.code === 'ResourceInUseException') return resolve('Exists');
					return reject(err);
				} else {
					return resolve(data);
				}
			}
		);
	});
};

createConfigsTable();
