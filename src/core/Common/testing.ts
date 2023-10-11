import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { ResponseData } from './ResponseModel';

export const OpenApiResponse = <DataDto extends Type<unknown>>(dataDto: DataDto) => {
  return applyDecorators(
    ApiExtraModels(ResponseData, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(ResponseData) },
          {
        properties: {
          statusCode: {
            type: 'number'
          },
          message: {
            type: 'string'
          },
         
          data: {
            type: 'array',
            items: { $ref: getSchemaPath(dataDto) }
          }
        }
      }
      ]
      }
    })
  );
};