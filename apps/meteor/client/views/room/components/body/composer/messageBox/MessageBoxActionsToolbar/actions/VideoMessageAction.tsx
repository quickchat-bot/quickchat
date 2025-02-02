import { Option, OptionIcon, OptionContent } from '@rocket.chat/fuselage';
import { MessageComposerAction } from '@rocket.chat/ui-composer';
import { useTranslation, useSetting } from '@rocket.chat/ui-contexts';
import React from 'react';

import type { ChatAPI } from '../../../../../../../../lib/chats/ChatAPI';
import { useChat } from '../../../../../../contexts/ChatContext';

type VideoMessageActionProps = {
	collapsed?: boolean;
	isRecording: boolean;
	chatContext?: ChatAPI; // TODO: remove this when the composer is migrated to React
};

const VideoMessageAction = ({ collapsed, chatContext, isRecording }: VideoMessageActionProps) => {
	const t = useTranslation();
	const fileUploadEnabled = useSetting('FileUpload_Enabled');
	const messageVideoRecorderEnabled = useSetting('Message_VideoRecorderEnabled');
	const fileUploadMediaTypeBlackList = useSetting('FileUpload_MediaTypeBlackList') as string;
	const fileUploadMediaTypeWhiteList = useSetting('FileUpload_MediaTypeWhiteList') as string;

	const chat = useChat() ?? chatContext;

	const handleOpenVideoMessage = () => {
		if (!chat?.composer?.recordingVideo.get()) {
			chat?.composer?.setRecordingVideo(true);
		}
	};

	const enableVideoMessage =
		navigator.mediaDevices &&
		window.MediaRecorder &&
		fileUploadEnabled &&
		messageVideoRecorderEnabled &&
		(!fileUploadMediaTypeBlackList || !fileUploadMediaTypeBlackList.match(/video\/webm|video\/\*/i)) &&
		(!fileUploadMediaTypeWhiteList || fileUploadMediaTypeWhiteList.match(/video\/webm|video\/\*/i)) &&
		window.MediaRecorder.isTypeSupported('video/webm; codecs=vp8,opus');

	if (!enableVideoMessage) {
		return null;
	}

	if (collapsed) {
		return (
			<Option
				{...((!enableVideoMessage || isRecording) && { title: t('Not_Available') })}
				disabled={!enableVideoMessage || isRecording}
				onClick={handleOpenVideoMessage}
			>
				<OptionIcon name='video' />
				<OptionContent>{t('Video_message')}</OptionContent>
			</Option>
		);
	}

	return (
		<MessageComposerAction
			data-qa-id='video-message'
			icon='video'
			disabled={!enableVideoMessage || isRecording}
			onClick={handleOpenVideoMessage}
			title={t('Video_message')}
		/>
	);
};

export default VideoMessageAction;
