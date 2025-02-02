const fetch = require('node-fetch');
const config = require('./conf.json');
const tmi = require('tmi.js');

const tw = new tmi.Client({
    channels: [config.channel],
    options: { debug: true },
    connection: { secure: true, reconnect: true }
});

tw.connect();

const WEBHOOK_URL = config.webhook_url;  // Webhook URL from Discord

async function sendToDiscord(content) {
    if (!WEBHOOK_URL) {
        console.error("Webhook URL is missing in config.json");
        return;
    }

    try {
        await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content })
        });
    } catch (error) {
        console.error("Error sending message to Discord:", error);
    }
}

tw.on('submysterygift', (channel, username, numbOfSubs) => {
    sendToDiscord(`${username} gifted ${numbOfSubs} subscriptions!`);
});

tw.on('subgift', (channel, username, streakMonths, recipient) => {
    sendToDiscord(`${username} gifted a subscription to ${recipient}!`);
});

tw.on('clearchat', () => {
    sendToDiscord("Chat was cleared.");
});

tw.on('subscription', (channel, username, methods, message, userstate) => {
    sendToDiscord(`**${userstate['display-name']}** has just subscribed to ${channel.slice(1)}!`);
});

tw.on('resub', (channel, username, months, message, userstate) => {
    const month = userstate['msg-param-streak-months'];
    if (month === undefined || month === true) {
        sendToDiscord(`**${userstate['display-name']}** resubscribed to ${channel.slice(1)} for **${userstate['msg-param-cumulative-months']}** months in a row!`);
    } else {
        sendToDiscord(`**${userstate['display-name']}** resubscribed to ${channel.slice(1)} for **${month}** months in a row!`);
    }
});

tw.on('hosting', (channel, target, viewers) => {
    sendToDiscord(`${channel.slice(1)} is hosting **${target}** ${viewers ? `with ${viewers} viewers` : ''}!`);
});

tw.on('hosted', (channel, username, viewers) => {
    sendToDiscord(`${username} is hosting **${channel.slice(1)}** ${viewers ? `with ${viewers} viewers` : ''}!`);
});

tw.on('message', (channel, userstate, message) => {
    const username = userstate['display-name'];
    sendToDiscord(`**${username}**: ${message}`);
});
