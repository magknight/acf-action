const core = require('@actions/core');
const fs = require("fs")
const path = require("path")
var version = core.getInput('version')
var src = core.getInput('src')
var acfName = core.getInput('acf-name')
var dest = core.getInput('dest')

function updateAcf() {
    if (core.getInput('write-acf') === 'true') {
        try {
            fs.readFile(`${src}/${acfName}.acf`, 'utf8', function (err, data) {
                if (err) {
                    return core.setFailed(err);
                }
                if (data.match(/P acf\/_version/)) {
                    data = data.replace(/(?<=P acf\/_version ).+(?<!\n)/, version)
                } else {
                    data = data.replace(/PROPERTIES_BEGIN/, "PROPERTIES_BEGIN\n" + "P acf/_version " + version)
                }
                var destination = `${dest}/${acfName}.acf`
                fs.mkdir(path.dirname(destination), { recursive: true }, (err) => {
                    if (err) throw err;
                });
                fs.writeFile(destination, data, 'utf8', function (err) {
                    if (err) return core.setFailed(err);
                });
            });
        } catch (error) {
            core.setFailed(err);
        }
    } else {
        return true
    }
}
function updateCfg() {
    if (core.getInput('write-cfg') === 'true') {
        fs.readFile(`${src}/skunkcrafts.json`, 'utf8', function (err, data) {
            var json = JSON.parse(data)
            var cfg = `zone|${json.zone}
module|${json.module}
name|${json.name}
version|${version}
locked|true`
            var destination = `${dest}/skunkcrafts_updater.cfg`
            fs.mkdir(path.dirname(destination), { recursive: true }, (err) => {
                if (err) throw err;
            });
            fs.writeFile(destination, data, 'utf8', function (err) {
                if (err) return core.setFailed(err);
            });
        })
    } else {
        return true
    }
}

function base() {
    updateAcf()
    updateCfg()
}
base()