const core = require("@actions/core");
const fs = require("fs");
const path = require("path");
var version = core.getInput("version");
var src = core.getInput("src");
var acfName = core.getInput("acf-name");
var dest = core.getInput("dest");

function updateAcf() {
	if (core.getInput("write-acf") === "true") {
		try {
			fs.readFile(
				path.join(src, `${acfName}.acf`),
				"utf8",
				function (err, data) {
					if (err) {
						return core.setFailed(err);
					}
					if (data.match(/P acf\/_version/)) {
						data = data.replace(/(?<=P acf\/_version ).+(?<!\n)/, version);
					} else {
						data = data.replace(
							/PROPERTIES_BEGIN/,
							"PROPERTIES_BEGIN\n" + "P acf/_version " + version
						);
					}
					if (data.match(/P acf\/_notes/)) {
						data = data.replace(/(?<=P acf\/_notes ).+(?<!\n)/, version);
					} else {
						data = data.replace(
							/PROPERTIES_BEGIN/,
							"PROPERTIES_BEGIN\n" + "P acf/_notes " + version
						);
					}
					var destination = path.join(dest, `${acfName}.acf`);
					fs.mkdir(path.dirname(destination), { recursive: true }, (err) => {
						if (err) throw err;
					});
					fs.writeFile(destination, data, "utf8", function (err) {
						if (err) return core.setFailed(err);
					});
				}
			);
		} catch (error) {
			core.setFailed(err);
		}
	} else {
		return true;
	}
}
function updateCfg() {
	if (core.getInput("write-cfg") === "true") {
		fs.readFile(
			path.join(src, `skunkcrafts.json`),
			"utf8",
			function (err, data) {
				var json = JSON.parse(data);
				var branch = core.getInput("branch");
				if (json[branch] != null) {
					json = json[branch];
					console.log(`Using branch ${branch}`);
				} else if (json["default"] != null) {
					json = json["default"];
					console.log(`Branch not found, using default`);
				} else {
					console.log(`Branch not found as subtable doesn't exist`);
				}
				var cfg = `zone|${json.zone}
module|${json.module}
name|${json.name}
version|${version}
locked|true`;
				var destination = path.join(dest, `/skunkcrafts_updater_config.txt`);
				fs.mkdir(path.dirname(destination), { recursive: true }, (err) => {
					if (err) throw err;
				});
				fs.writeFile(destination, cfg, "utf8", function (err) {
					if (err) return core.setFailed(err);
				});
			}
		);
	} else {
		return true;
	}
}

function base() {
	updateAcf();
	updateCfg();
}
base();
