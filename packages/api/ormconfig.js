module.exports = {
    type: 'sqlite',
    database: './data/tindrive.sqlite3',
    synchronize: true,
    logging: true,
    entities: [
        process.env.NODE_ENV === 'production'
            ? './src/**/*.entity.ts'
            : undefined,
        './dist/**/*.entity.js',
    ],
};
