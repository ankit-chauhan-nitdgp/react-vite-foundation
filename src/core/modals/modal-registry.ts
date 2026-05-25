import type { ModalComponent, ModalType } from './types'

const registry = new Map<ModalType, ModalComponent<ModalType>>()

export function registerModal<T extends ModalType>(type: T, component: ModalComponent<T>): void {
  registry.set(type, component as ModalComponent<ModalType>)
}

export function getRegisteredModal(type: ModalType): ModalComponent<ModalType> | undefined {
  return registry.get(type)
}

export function listRegisteredModals(): ModalType[] {
  return Array.from(registry.keys())
}
