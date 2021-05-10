import configService from '../../services/config.service'

export class ConfigController{

    getConfig(req, res) {
        configService.getConfig(req.params.accesstoken).then(r => {
            if(r) res.json(r);
            else res.json({});
        }, (err) => {
            res.json({error : err ? err.toString(): 'get config failed'});
        });
    }

    saveConfig(req, res) {
        configService.saveConfig(req.body.accesstoken, req.body.update).then(r => {
            if(r){
                res.json(r);
            }
            else{
                configService.createConfig(req.body.accesstoken, req.body.update).then(config => {
                    if(config) {
                        res.json(config);
                    }
                    else res.json({});
                }, (err) => {
                    res.json({error : err ? err.toString() : 'create config failed'});
                });
            }   
        }, (err) => {
            res.json({error : err ? err.toString() : 'update config failed'});
        });
    }

}

export default new ConfigController()