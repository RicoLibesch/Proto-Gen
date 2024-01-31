const validateUsers = (users, password) => {
    //Check for missing uid
    if(users.find(user => !user.uid)) {
        console.error("Error: A user is missing an uid");
        process.exit(1);
    }
    
    //Check for duplicates
    if(new Set(users.map(user => user.uid)).size !== users.length) {
        console.error("Error: Duplicate uid found in users");
        process.exit(1);
    }

    //Check for missing attributes
    users.forEach(user => {
        if(!user.dn || 
            !user.attributes.uid || 
            !user.attributes.givenName || 
            !user.attributes.displayName || 
            !user.attributes.sn ||
            !user.attributes.mail) 
        {
            console.error(`Error: User ${user.uid} is missing an attribute`);
            process.exit(1);
        }
    });

    //Print test users
    console.log(`Loaded ${users.length} test users:`);
    users.forEach(user => {
        console.log(`uid: ${user.uid}, displayName: ${user.attributes.displayName}, password: ${password}`);
    });
};

module.exports = {
    validateUsers
};