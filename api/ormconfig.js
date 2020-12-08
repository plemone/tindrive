module.exports = {
    type: 'sqlite',
    database: './data/tindrive.db',
    autoSchemeSync: true,
    logging: true,
    entities: [
        process.env.NODE_ENV === 'production'
            ? './src/**/*.entity.ts'
            : undefined,
        './dist/**/*.entity.js',
    ],
};
