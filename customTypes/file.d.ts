export type File = {
    _id: ObjectId;
    url: string;
    mimeType: string;
    preview: string;
};

export type Image = {
    url: string;
    mimeType: string;
    height: number;
    width: number;
    blurred?: string;
};

export type ImageObject = {
    _id: ObjectId;
    default: Image;
    thumbnail: Image;
    blurred: string;
};
