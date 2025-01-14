import type { ReactElement } from 'react';
import { useContext, createContext } from 'react';

type ComposerPopupItem<T> = T extends { _id: string; sort?: number } ? T : never;

export type ComposerPopupOption<T extends { _id: string; sort?: number } = { _id: string; sort?: number }> = {
	title?: string;
	getItemsFromLocal: (filter: string) => Promise<T[]>;
	getItemsFromServer: (filter: string) => Promise<T[]>;
	blurOnSelectItem?: boolean;
	closeOnEsc?: boolean;

	trigger?: string;
	triggerAnywhere?: boolean;

	suffix?: string;
	prefix?: string;

	matchSelectorRegex?: RegExp;

	getValue: (item: ComposerPopupItem<T>) => string;

	renderItem?: ({ item }: { item: T }) => ReactElement;
};

export type ComposerPopupContextValue = ComposerPopupOption[];

export const ComposerPopupContext = createContext<ComposerPopupContextValue | undefined>(undefined);

export const createMessageBoxPopupConfig = <T extends { _id: string; sort?: number }>(
	partial: Omit<ComposerPopupOption<T>, 'getValue'> & Partial<Pick<ComposerPopupOption<T>, 'getValue'>>,
): ComposerPopupOption<T> => {
	return {
		blurOnSelectItem: true,
		closeOnEsc: true,
		triggerAnywhere: true,
		suffix: ' ',
		prefix: partial.trigger ?? ' ',
		getValue: (item) => item._id,
		...partial,
	};
};

export const useComposerPopup = () => {
	const composerPopupContext = useContext(ComposerPopupContext);
	if (!composerPopupContext) {
		throw new Error('useComposerPopup must be used within ComposerPopupContext');
	}
	return composerPopupContext;
};
