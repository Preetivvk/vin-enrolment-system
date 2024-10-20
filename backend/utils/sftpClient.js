const SFTPClient = require('ssh2-sftp-client');
const fs = require('fs');
const csv = require('csv-parser');
const { rateLimitedDecodeVIN } = require('./nhtsaClient');

const sftp = new SFTPClient();

exports.pollSFTPServer = async function() {
    try {
        await sftp.connect({
            host: process.env.SFTP_HOST,
            port: process.env.SFTP_PORT,
            username: process.env.SFTP_USERNAME,
            password: process.env.SFTP_PASSWORD,
        });

        const fileList = await sftp.list('/vins/2024/10');
        console.log('File list:', fileList);

        const csvFile = fileList.find(file => file.name.endsWith('.csv'));
        if (csvFile) {
            const localFilePath = `./${csvFile.name}`;
            await sftp.fastGet(`/vins/2024/10/${csvFile.name}`, localFilePath);
            processCSV(localFilePath);
        } else {
            console.log('No CSV file found');
        }

        await sftp.end();
    } catch (err) {
        console.error('Error fetching files from SFTP:', err);
    }
}

function processCSV(filePath) {
    const vinList = [];
    fs.createReadStream(filePath)
        .pipe(csv(['VIN']))
        .on('data', (row) => {
            vinList.push(row.VIN);
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
            vinList.forEach(vin => rateLimitedDecodeVIN(vin));
            fs.unlinkSync(filePath);
        });
}
