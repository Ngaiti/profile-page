import { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "@firebase/storage";
import { storage } from "../firebase";

const ProfilePage = () => {
	const [progress, setProgress] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [file, setFile] = useState(null);
	const [url, setUrl] = useState(null);
	const [username, setUsername] = useState("John Doe");
	const [description, setDescription] = useState(
		"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet tincidunt risus."
	);
	const [isEditingUsername, setIsEditingUsername] = useState(false);
	const [isEditingDescription, setIsEditingDescription] = useState(false);
	const [isEditingImage, setIsEditingImage] = useState(false);

	const onFileUpload = () => {
		if (!file) return;
		setIsLoading(true);
		const storageRef = ref(storage, `/files/${file.name}`);
		const uploadTask = uploadBytesResumable(storageRef, file);

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress = Math.round(
					(snapshot.bytesTransferred / snapshot.totalBytes) * 100
				);
				setProgress(progress);
			},
			(err) => {
				console.log(err);
				setIsLoading(false);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then((url) => {
					setUrl(url);
					setIsLoading(false);
				});
			}
		);
	};

	const onFileChange = (e) => {
		setFile(e.target.files[0]);
		e.preventDefault();
	};

	const handleEditUsername = () => {
		setIsEditingUsername(true);
	};

	const handleEditDescription = () => {
		setIsEditingDescription(true);
	};

	const handleEditImage = () => {
		setIsEditingImage(true);
	};

	const handleSaveUsername = () => {
		setIsEditingUsername(false);
	};

	const handleSaveDescription = () => {
		setIsEditingDescription(false);
	};

	const handleSaveImage = () => {
		setIsEditingImage(false);
		setFile(null);
		setProgress(0);
		setUrl(null);
	};

	return (
		<>
			<div>
				{isEditingImage ? (
					<>
						<input type="file" onChange={onFileChange} />
						<button onClick={onFileUpload}>Upload Image</button>
						{isLoading && (
							<p>
								File upload <b>{progress}%</b>
							</p>
						)}
						{url && (
							<img
								src={url}
								alt="Uploaded"
								className="img-fluid"
							/>
						)}
						<button onClick={handleSaveImage}>Save Image</button>
					</>
				) : (
					<>
						<img src={url} alt="Profile" className="img-fluid" />
						<button onClick={handleEditImage}>Edit Image</button>
					</>
				)}
			</div>
			<div>
				{isEditingUsername ? (
					<>
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
						<button onClick={handleSaveUsername}>Save</button>
					</>
				) : (
					<>
						<h3>{username}</h3>
						<button onClick={handleEditUsername}>Edit</button>
					</>
				)}
			</div>
			<div>
				{isEditingDescription ? (
					<>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
						<button onClick={handleSaveDescription}>Save</button>
					</>
				) : (
					<>
						<p>{description}</p>
						<button onClick={handleEditDescription}>Edit</button>
					</>
				)}
			</div>
		</>
	);
};

export default ProfilePage;
