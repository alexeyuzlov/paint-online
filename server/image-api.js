const imageStore = {};

const uploadImage = (req, res) => {
    try {
        const data = req.body.img.replace(`data:image/png;base64,`, '');
        const buffer = Buffer.from(data, 'base64');
        imageStore[req.query.id] = buffer;
        return res.status(200).json({ message: "Загружено в память" });
    } catch (e) {
        return res.status(200).json({ message: 'Ошибка при загрузке изображения' });
    }
};

const getImage = (req, res) => {
    try {
        const imageId = req.query.id;
        const buffer = imageStore[imageId];

        if (!buffer) {
            return res.status(200).json(null);
        }

        const data = `data:image/png;base64,` + buffer.toString('base64');
        return res.status(200).json(data);
    } catch (e) {
        return res.status(200).json({ message: 'Ошибка при получении изображения' });
    }
};

module.exports = { uploadImage, getImage };