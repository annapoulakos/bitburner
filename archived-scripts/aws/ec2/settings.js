export const FLAGS = {
    'create-instance': [['size', 32]],
};

export const SERVER_NAMES = [
    'us-east-1',
    'us-east-2',
    'us-west-1',
    'us-west-2',
    'af-south-1',
    'ap-east-1',
    'ap-southeast-3',
    'ap-south-1',
    'ap-northeast-3',
    'ap-northeast-2',
    'ap-southeast-1',
    'ap-southeast-2',
    'ap-northeast-1',
    'ca-central-1',
    'eu-central-1',
    'eu-west-1',
    'eu-west-2',
    'eu-south-1',
    'eu-west-3',
    'eu-north-1',
    'me-south-1',
    'sa-east-1',
    'us-gov-east-1',
    'us-gov-east-2',
    'anna-wi-1',
];

export const HELP_DOCS = {
    'help': 'aws ec2 help',
    'create-instance': 'aws ec2 create-instance --size INT_SIZE_RAM',
    'describe-instances': 'aws ec2 describe-instances',
    'delete-all-instances': 'aws ec2 delete-all-instances',
    'delete-instance': 'aws ec2 delete-instance --instance-id INSTANCE_ID',
};
