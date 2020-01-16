import App from './App.svelte';
import './App.scss';

const app = new App({
	target: document.body,
	props: {
		appVersion: 1
	}
});

export default app;