export const setImageHandler = (canvasRef: HTMLCanvasElement, imageUrl: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const ctx = canvasRef.getContext('2d')!;

        img.src = imageUrl;
        img.onload = () => {
            try {
                ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
                ctx.drawImage(img, 0, 0, canvasRef.width, canvasRef.height);
                resolve();
            } catch (error) {
                reject(error);
            }
        };
    });
};