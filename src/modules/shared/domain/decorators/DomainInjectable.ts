import { Injectable, SetMetadata } from '@nestjs/common';

export const DomainInjectableMetadataKey = 'domain_injectable_metadata';

export function DomainInjectable(): ClassDecorator {
  return (target: any) => {
    Injectable()(target);

    SetMetadata(DomainInjectableMetadataKey, true)(target);
  };
}
