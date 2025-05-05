const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './index.js', // Точка входа
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js', // Имя выходного файла
        clean: true, // Очистка папки dist перед сборкой
    },
    module: {
        rules: [
            {
                test: /\.css$/, // Обработка CSS-файлов
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/i, // Обработка изображений
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html', // Шаблон HTML
            filename: 'index.html',
        }),
    ],
    devServer: {
        static: './dist',
        open: true, // Автоматически открывать браузер
        port: 3000, // Порт для разработки
    },
};