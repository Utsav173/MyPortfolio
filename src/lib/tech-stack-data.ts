export type TechDetails = Record<
	string,
	{ icon: string; color: string; name: string; darkmodecolor?: string }
>;

export const TECH_STACK_DETAILS: TechDetails = {
	// Frontend
	'react.js': { icon: 'logos:react', color: '#61DAFB', name: 'React.js' },
	'next.js': {
		icon: 'teenyicons:nextjs-outline',
		color: '#000000',
		darkmodecolor: '#FFFFFF',
		name: 'Next.js',
	},
	redux: { icon: 'logos:redux', color: '#764ABC', name: 'Redux' },
	typescript: {
		icon: 'logos:typescript-icon',
		color: '#3178C6',
		name: 'TypeScript',
	},
	'javascript (es6+)': {
		icon: 'logos:javascript',
		color: '#F7DF1E',
		name: 'JavaScript (ES6+)',
	},
	html5: { icon: 'logos:html-5', color: '#E34F26', name: 'HTML5' },
	css3: { icon: 'logos:css-3', color: '#1572B6', name: 'CSS3' },
	'tailwind css': {
		icon: 'logos:tailwindcss-icon',
		color: '#06B6D4',
		name: 'Tailwind CSS',
	},
	'shadcn/ui': {
		icon: 'simple-icons:shadcnui',
		color: '#000000',
		darkmodecolor: '#FFFFFF',
		name: 'Shadcn/UI',
	},
	'material-ui': {
		icon: 'logos:material-ui',
		color: '#007FFF',
		name: 'Material-UI',
	},
	NeonDB: {
		icon: 'logos:neon-icon',
		name: 'NeonDB',
		color: '#000000',
	},

	// Backend
	'node.js': { icon: 'logos:nodejs-icon', color: '#339933', name: 'Node.js' },
	'bun.js': { icon: 'logos:bun', color: '#FBF0DF', name: 'Bun.js' },
	'hono.js': { icon: 'logos:hono', color: '#E36002', name: 'Hono.js' },
	'express.js': {
		icon: 'simple-icons:express',
		color: '#000000',
		darkmodecolor: '#FFFFFF',
		name: 'Express.js',
	},
	'restful apis': { icon: 'mdi:api', color: '#85a2b6', name: 'RESTful APIs' },
	graphql: { icon: 'logos:graphql', color: '#E10098', name: 'GraphQL' },
	microservices: {
		icon: 'carbon:microservices-1',
		color: '#3c87c8',
		name: 'Microservices',
	},
	websockets: {
		icon: 'logos:socket-io',
		color: '#010101',
		darkmodecolor: '#FFFFFF',
		name: 'WebSockets',
	},
	serverless: {
		icon: 'logos:aws-lambda',
		color: '#FF9900',
		name: 'Serverless',
	},

	// Databases
	postgresql: {
		icon: 'logos:postgresql',
		color: '#4169E1',
		name: 'PostgreSQL',
	},
	mongodb: { icon: 'logos:mongodb-icon', color: '#47A248', name: 'MongoDB' },
	mysql: { icon: 'logos:mysql', color: '#4479A1', name: 'MySQL' },
	redis: { icon: 'logos:redis', color: '#DC382D', name: 'Redis' },
	'drizzle orm': {
		icon: 'simple-icons:drizzle',
		color: '#C5F65F',
		name: 'Drizzle ORM',
	},
	prisma: {
		icon: 'simple-icons:prisma',
		color: '#2D3748',
		darkmodecolor: '#FFFFFF',
		name: 'Prisma',
	},

	// Cloud & DevOps
	aws: { icon: 'logos:aws', color: '#FF9900', name: 'AWS' },
	'google cloud (gcp)': {
		icon: 'logos:google-cloud',
		color: '#4285F4',
		name: 'Google Cloud (GCP)',
	},
	cloudflare: {
		icon: 'logos:cloudflare-icon',
		color: '#F38020',
		name: 'Cloudflare',
	},
	vercel: {
		icon: 'ion:logo-vercel',
		color: '#000000',
		darkmodecolor: '#FFFFFF',
		name: 'Vercel',
	},
	netlify: { icon: 'logos:netlify-icon', color: '#00C7B7', name: 'Netlify' },
	'ci/cd (github actions)': {
		icon: 'logos:github-actions',
		color: '#2088FF',
		name: 'CI/CD',
	},
	docker: { icon: 'logos:docker-icon', color: '#2496ED', name: 'Docker' },
	git: { icon: 'logos:git-icon', color: '#F05032', name: 'Git' },

	// AI & Special Interests
	'generative ai': {
		icon: 'carbon:machine-learning-model',
		color: '#8A2BE2',
		name: 'Generative AI',
	},
	llms: {
		icon: 'fluent:brain-circuit-24-regular',
		color: '#5F9EA0',
		name: 'LLMs',
	},
	'api security': {
		icon: 'material-symbols:security',
		color: '#FF4500',
		name: 'API Security',
	},
	'performance opt.': {
		icon: 'fluent-mdl2:speed-high',
		color: '#32CD32',
		name: 'Performance Opt.',
	},
	scalability: {
		icon: 'mdi:chart-gantt',
		color: '#FFD700',
		name: 'Scalability',
	},

	// Tools & Methodologies
	'vs code': {
		icon: 'logos:visual-studio-code',
		color: '#007ACC',
		name: 'VS Code',
	},
	postman: { icon: 'logos:postman-icon', color: '#FF6C37', name: 'Postman' },
	'swagger/openapi': {
		icon: 'logos:swagger',
		color: '#85EA2D',
		name: 'Swagger/OpenAPI',
	},
	figma: { icon: 'logos:figma', color: '#F24E1E', name: 'Figma' },
	jira: { icon: 'logos:jira', color: '#0052CC', name: 'Jira' },
	'agile/scrum': {
		icon: 'mdi:account-group-outline',
		color: '#0098DB',
		name: 'Agile/Scrum',
	},
	tdd: { icon: 'mdi:test-tube', color: '#A040A0', name: 'TDD' },
};
