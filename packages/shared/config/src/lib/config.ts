import AWS from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();

export interface IConfig {
	vk_group_id: string;
	vk_group_token: string;
	vk_group_callback: string;
	vk_last_post_id: string;
	name: string;
	tg_token: string;
	tg_chat_id: string;
	tg_error_chat_id: string;
	extra: object;
}

AWS.config.update({
	dynamodb: {
		endpoint: new AWS.Endpoint(process.env['AWS_ENDPOINT']),
		region: 'ru-central1-a'
	},
	accessKeyId: process.env['AWS_ACCESS_KEY_ID'],
	secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY']
});

class Config {
	devConfig: IConfig = {
		vk_group_id: process.env['VK_GROUP_ID'] ?? '',
		vk_group_token: process.env['VK_GROUP_TOKEN'] ?? '',
		vk_group_callback: process.env['VK_GROUP_CALLBACK'] ?? '',
		vk_last_post_id: process.env['VK_LAST_POST_ID'] ?? '',
		name: process.env['NAME'] ?? '',
		tg_token: process.env['TG_TOKEN'] ?? '',
		tg_chat_id: process.env['TG_CHAT_ID'] ?? '',
		tg_error_chat_id: process.env['TG_ERROR_CHAT_ID'] ?? '',
		extra: null
	};
	cachedConfig: IConfig = null;
	configsTableName = 'configs';
	init = async (vkGroupId: string | number): Promise<IConfig> => {
		vkGroupId = String(vkGroupId).charAt(0) === '-' ? String(vkGroupId).substring(1) : String(vkGroupId);
		return new Promise((resolve, reject) => {
			const documentClient = new AWS.DynamoDB.DocumentClient();
			documentClient.get(
				{
					TableName: this.configsTableName,
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
							this.cachedConfig = data.Item as IConfig;
							return resolve(this.cachedConfig);
						}
						return resolve(null);
					}
				}
			);
		});
	};
	get = (): IConfig => {
		if (this.cachedConfig) return this.cachedConfig;
		if (process.env.NODE_ENV === 'development') return this.devConfig;
		// if (process.env.NODE_ENV === 'development' || (process.env.NODE_ENV === 'test' && this.devConfig.vk_group_id)) return this.devConfig;
		return null;
	};
}
export default new Config();
