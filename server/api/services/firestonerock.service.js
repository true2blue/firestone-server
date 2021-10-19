import l from '../../common/logger';
import child_process from 'child_process';
import util from 'util'
import http from 'http'
import https from 'https'
import querystring from 'querystring'
import zlib from 'zlib'

class FireStoneRockService {

    constructor() {
        this.exec = util.promisify(child_process.exec)
        this.options = {
            'hostname': 'mncg.10jqka.com.cn',
            'port': 80,
            'path': '/cgiwt/delegate/qryChengjiao',
            'method': 'POST',
            'headers': {
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'en-US,en;q=0.9',
                'Connection': 'keep-alive',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'Host': 'mncg.10jqka.com.cn',
                'Referer': 'http://mncg.10jqka.com.cn/cgiwt/index/index',
                'X-Requested-With': 'XMLHttpRequest',
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.119 Safari/537.36'
            }
        };
        this.dfcf_options = {
            'hostname': 'jy.xzsec.com',
            'port': 443,
            'method': 'POST',
            'headers': {
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'en-US,en;q=0.9',
                'Connection': 'keep-alive',
                'Referer': 'https://jy.xzsec.com/Trade/Sale',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Host': 'jy.xzsec.com',
                'Origin': 'https://jy.xzsec.com',
                'sec-ch-ua': '"Chromium";v="94", "Google Chrome";v="94", ";Not A Brand";v="99"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.71 Safari/537.36',
                'X-Requested-With': 'XMLHttpRequest'
            }
        };
    }

    async createNewFirerock(codes, tradeId, isMock) {
        let msg = `start the firestonerock service code=${codes}, tradeId=${tradeId}, isMock=${isMock}`;
        l.info(msg);
        if(process.env.ENABLE_FIREROCK === 'true'){
            let seconds = '"2,5,8,11,14,17,20,23,26,29,32,35,38,41,44,47,50,53,56,59"';
            if(codes[0] == 'N/A'){
                seconds = '3';
            }
            this.exec(`shell\\runfirerock ${tradeId} ${seconds} ${isMock}`);
            return new Promise((resolve, reject) => {
                resolve({ 'success': msg });
            });
        }
        else{
            return Promise.resolve({ 'success': msg, 'message' : 'FIREROCK is disable, ignore createNewFirerock'})
        }
    }

    async start_heart_beat(headers) {
        if (process.env.ENABLE_THS_HEART_BEAT === 'true') {
            Object.assign(this.options.headers, headers)
            return new Promise((resolve, reject) => {
                let req = http.request(this.options, (res) => {
                    res.on('data', (d) => {
                        zlib.gunzip(d, function (err, dezipped) {
                            if (err) {
                                l.error('failed to parse the heart beat result');
                            }
                            else {
                                let result = dezipped.toString();
                                l.info(`send heart beat to ths get response = ${result}`);
                                resolve(JSON.parse(result));
                            }
                        });
                    });
                })

                req.on('error', (e) => {
                    l.error(`send heart beat to ths error, e = ${e}`);
                    reject(e);
                });

                req.end();
            });
        }
        else {
            return Promise.resolve({ errorcode: 0, message: 'THS_HEART_BEAT is disable, ignore the heart beat' });
        }
    }


    async start_heart_beat_dfcf(headers, validatekey) {
        this.dfcf_options['path'] = '/Search/GetDealData?validatekey=' + validatekey;
        headers['gw_reqtimestamp'] = new Date().getTime()
        Object.assign(this.dfcf_options.headers, headers);
        return new Promise((resolve, reject) => {
            let req = https.request(this.dfcf_options, (res) => {
                res.on('data', (d) => {
                    let result = JSON.parse(d)
                    if(result['Status'] == 0){
                        l.info(`send heart beat to dfcf get response = ${d}`);
                        resolve(result);
                    }
                    else{
                        l.error(`failed to parse the heart beat dfcf result = ${d}`);
                        reject(result);
                    }
                });
            })

            req.on('error', (e) => {
                l.error(`send heart beat to dfcf error, e = ${e}`);
                reject(e);
            });

            req.write(querystring.stringify({
                'qqhs': '10',
                'dwc': ''
            }));

            req.end();
        });
    }

}

export default new FireStoneRockService()