import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {ɵComponentType} from '@angular/core';

// Reference https://github.com/ngneat/until-destroy

const SYMBOL: unique symbol = Symbol('__destroy');
const DECORATOR_APPLIED: unique symbol = Symbol('__untilDestroyApplied');

function markAsDecorated<T>(type: ɵComponentType<T>): void {
  // Store this property on the prototype if it's a component.
  // We will be able to handle class extension this way.
  type.prototype[DECORATOR_APPLIED] = true;
}

function missingDecorator<T>(type: ɵComponentType<T>): boolean {
  return !(DECORATOR_APPLIED in type.prototype);
}

function ensureClassIsDecorated(instance: any): never | void {
  if (missingDecorator(instance.constructor)) {
    throw Error(
      `untilDestroyed operator cannot be used inside
      components that are not decorated with UntilDestroy decorator`,
    );
  }
}

function createSubjectOnTheInstance(instance: any): void {
  if (!instance[SYMBOL]) {
    instance[SYMBOL] = new Subject<void>();
  }
}

function completeSubjectOnTheInstance(instance: any): void {
  if (instance[SYMBOL]) {
    instance[SYMBOL].next();
    instance[SYMBOL].complete();
    // We also have to delete or null this property thus in the future
    // we will be able to create new subject on the same instance.
    delete instance[SYMBOL];
  }
}

function decorateNgOnDestroy(ngOnDestroy: (() => void) | null | undefined) {
  return function (this: any): void {
    // Invoke the original `ngOnDestroy` if it exists
    ngOnDestroy && ngOnDestroy.call(this);
    // It's important to use `this` instead of caching instance
    // that may lead to memory leaks
    completeSubjectOnTheInstance(this);
  };
}

function decorateComponent<T>(type: ɵComponentType<T>): void {
  type.prototype.ngOnDestroy = decorateNgOnDestroy(type.prototype.ngOnDestroy);
}

export function UntilDestroy(): ClassDecorator {
  return (type: any): void => {
    decorateComponent(type);
    markAsDecorated(type);
  };
}

export function untilDestroyed<T>(instance: T) {
  return <U>(source: Observable<U>) => {
    ensureClassIsDecorated(instance);
    createSubjectOnTheInstance(instance);

    // @ts-expect-error
    return source.pipe(takeUntil<U>(instance[SYMBOL]));
  };
}
