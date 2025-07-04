import { getDriveClient } from './drive'

interface Photo {
	id: string
	name: string
	thumbnailLink?: string | null
}

interface Album {
	name: string
}

export async function setInitialCover(folderId: string, fileId: string): Promise<{ newName: string }> {
	const drive = getDriveClient()

	const fileRes = await drive.files.get({ fileId: fileId, fields: 'name' })
	const originalName = fileRes.data.name
	if (!originalName) throw new Error('Could not get file name')

	const nameWithoutCover = originalName.replace(/_cover/g, '')
	const extensionIndex = nameWithoutCover.lastIndexOf('.')
	let coverName: string

	if (extensionIndex !== -1) {
		const name = nameWithoutCover.substring(0, extensionIndex)
		const extension = nameWithoutCover.substring(extensionIndex)
		coverName = `${name}_cover${extension}`
	} else {
		coverName = `${nameWithoutCover}_cover`
	}

	await drive.files.update({
		fileId: fileId,
		requestBody: { name: coverName },
	})

	return { newName: coverName }
}

export async function getAlbumDetails(albumId: string): Promise<Album> {
	const drive = getDriveClient()
	const response = await drive.files.get({
		fileId: albumId,
		fields: 'name',
	})
	return response.data as Album
}

export async function getPhotos(albumId: string): Promise<Photo[]> {
	const drive = getDriveClient()
	const response = await drive.files.list({
		q: `'${albumId}' in parents and mimeType contains 'image/' and trashed=false`,
		fields: 'files(id, name, thumbnailLink)',
		pageSize: 1000,
	})

	return (response.data.files as Photo[]) || []
}
