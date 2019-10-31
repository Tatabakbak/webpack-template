module.exports = {
    plugins: [
        require('autoprefixer'),
        require('css-mqpacker'), //сжатие медиа-запросов
        require('cssnano')({    //минификатор
                preset: [
                    'default', {
                        discardComments: {
                            removeAll: true
                        }
                    }
                ]
            })
    ]
};