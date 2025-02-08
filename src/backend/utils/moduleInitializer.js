const { ModuleConfig } = require('../models');

const initializeModules = async () => {
    try {
        const modules = await ModuleConfig.findAll();

        modules.forEach(module => {
            if (module.enabled) {
                console.log(`Module '${module.name}' is enabled.`);
                // Logic to enable the module (loading routes, features dynamically)
            } else {
                console.log(`Module '${module.name}' is disabled.`);
                // Skip loading this module
            }
        });
    } catch (error) {
        console.error('Error initializing modules:', error);
    }
};

module.exports = { initializeModules };
