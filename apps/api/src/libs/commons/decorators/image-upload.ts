import {
  createParamDecorator,
  ExecutionContext,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseFilePipe,
} from '@nestjs/common';

export const ImageUploadProp = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_FILE_TYPES: '(jpg|jpeg|png|webp)$',
};

export const ImageUpload = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  const imageUploadPipe = new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({
        maxSize: ImageUploadProp.MAX_FILE_SIZE,
      }),
      new FileTypeValidator({
        fileType: ImageUploadProp.SUPPORTED_FILE_TYPES,
      }),
    ],
    fileIsRequired: true,
  });

  return imageUploadPipe.transform(request.file);
});
