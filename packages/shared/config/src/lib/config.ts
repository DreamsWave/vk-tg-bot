import AWS from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();

export interface Config {
	vk_group_id: string;
	vk_group_token: string;
	vk_group_callback: string;
	name: string;
	tg_token: string;
	tg_chat_id: string;
	tg_error_chat_id: string;
	extra: object;
}

const devConfig: Config = {
	vk_group_id: process.env['VK_GROUP_ID'] ?? '',
	vk_group_token: process.env['VK_GROUP_TOKEN'] ?? '',
	vk_group_callback: process.env['VK_GROUP_CALLBACK'] ?? '',
	name: process.env['NAME'] ?? '',
	tg_token: process.env['TG_TOKEN'] ?? '',
	tg_chat_id: process.env['TG_CHAT_ID'] ?? '',
	tg_error_chat_id: process.env['TG_ERROR_CHAT_ID'] ?? '',
	extra: null
};

let cachedConfig: Config = null;
const configsTableName = 'configs';

AWS.config.update({
	dynamodb: {
		endpoint: new AWS.Endpoint(process.env['AWS_ENDPOINT']),
		region: 'ru-central1-a'
	},
	accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
	secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY']
});

export const initConfig = (vkGroupId?: string | number): Promise<Config> => {
	if (vkGroupId) {
		vkGroupId = String(vkGroupId).charAt(0) === '-' ? String(vkGroupId).substring(1) : String(vkGroupId);
	}
	return new Promise((resolve, reject) => {
		const documentClient = new AWS.DynamoDB.DocumentClient();
		documentClient.get(
			{
				TableName: configsTableName,
				ConsistentRead: true,
				Key: {
					vk_group_id: vkGroupId
				}
			},
			function (err, data) {
				if (err) {
					return reject(err);
				} else {
					if (data.Item.vk_group_id === vkGroupId) {
						cachedConfig = data.Item as Config;
						return resolve(cachedConfig);
					}
					return resolve(null);
				}
			}
		);
	});
};

export const getConfig = (): Config => {
	if (cachedConfig) return cachedConfig;
	if (process.env.NODE_ENV === 'development' || (process.env.NODE_ENV === 'test' && devConfig.vk_group_id)) return devConfig;
	return null;
};
