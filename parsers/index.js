const httpParser = require("./http");

function parseLogHead(line) {
	const [head, ...body] = line.trim().split(" ");
	const [service, level, type, subType, ...rest] = head.split(":");
	return {
		head,
		service,
		level: convertLevel(level),
		type,
		subType,
		headRest: rest,
		body: body.join(" "),
	};
}

function parseLog(head, body) {
	if (
		head.endsWith(":http") &&
		body.match(/(POST|GET|PATCH|DELETE|HEAD|PUT):/)
	) {
		return httpParser(body);
	} else {
		return {};
	}
}

function convertLevel(level) {
	switch (level) {
		case "trace":
		case "debug":
			return "debug";
		case "info":
			return "info";
		case "log":
			return "notice";
		case "warn":
			return "warning";
		case "error":
			return "error";
		default:
			return "notice";
	}
}
module.exports = {
	parseLog,
	parseLogHead,
};
