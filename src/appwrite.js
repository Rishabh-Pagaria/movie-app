import { Client, Query } from 'appwrite';

const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const collectionId = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
.setEndpoint('https://cloud.appwrite.io/v1')
.setProject(projectId)

const database = new Databases(client);
export const updateSearchCount = async(searchTerm, movie)=>{
    // checking if the the searchTerm exists in the databse
    try{
        const response = await database.listDocuments(databaseId, collectionId, [
            Query.equal('searchTerm', searchTerm),
        ]);

        // if it exists,  update the count
        if(response.documents.length > 0){
            const doc = response.documents[0];
            await  database.updateDocument(databaseId, collectionId, doc.$id, {
                count : doc.count + 1
            })
        //  if it does not exist, create a new document
        } 
        else{
            await database.createDocument(databaseId, collectionId, {
                searchTerm,
                count : 1,
                movie_id: movie.id,
                poster_url: `https://image,tmdb.org/t/p/w500/${movie.poster_path}`,
            })
        }
    }
};