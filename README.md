**Vehicle Enrollment and VIN Validation System**
This project is a backend system that allows users to upload CSV files containing Vehicle Identification Numbers (VINs) through an SFTP server. 
The system downloads the CSV files, checks the validity of each VIN using the National Highway Traffic Safety Administration (NHTSA) API, and enrolls the vehicle in a database if the VIN is valid. 
The enrollment status is set to inProgress for valid entries.

**Features**
**SFTP Integration**: Users upload CSV files containing VINs via an SFTP server.
**VIN Validation**: The VINs are validated against the NHTSA API, retrieving relevant vehicle details such as car model.
**Rate Limiting**: VIN decoding requests to the NHTSA API are rate-limited to 5 requests per minute.
**Vehicle Enrollment**: Upon successful validation, vehicle details are enrolled in the system, and the status is updated accordingly.
**CSV File Processing**: Once the CSV file is processed, it is deleted from the local system.

**Technologies Used**
**Node.js**: Backend framework.
**Express.js**: Web framework for Node.js.
**MongoDB**: NoSQL database for storing enrollment data.
**SFTP**: Secure FTP for file transfer.
**NHTSA API**: For VIN validation and vehicle details retrieval.
**csv-parser**: Node.js library for parsing CSV files.
**ssh2-sftp-client**: SFTP client for handling file uploads and downloads.
