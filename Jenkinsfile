pipeline {
    agent any
    
    stages 
    {
        stage("Cloning the git repo")
        {
            steps
            {
                echo "Cloning the Github Repo"
                git url: 'https://github.com/Animish22/firebase-aniblog.git' , branch: 'main'
                echo "Github Repo Successfully Cloned"
            }
        }
        stage('Create and Populate .env Files') 
        {
            steps 
            {
                script 
                {
                    // Define the content for each .env file
                    def backendEnvContent = "FRONTEND_BASEURL=http://localhost:5173"
                    def frontendEnvContent = "VITE_REACT_APP_BACKEND_BASEURL=http://localhost:3000"

                    // --- Process Backend Folder ---
                    dir('server') 
                    { 
                        def backendEnvFile = '.env'
                        if (isUnix()) 
                        {
                            // Check if .env exists in backend, if not, create and write
                            sh "[ -f ${backendEnvFile} ] || echo \"${backendEnvContent}\" > ${backendEnvFile}"
                             // If it exists, append the line if not already present (optional, but good practice)
                            sh "grep -qF \"${backendEnvContent}\" ${backendEnvFile} || echo \"${backendEnvContent}\" >> ${backendEnvFile}"
                        } 
                        else 
                        {
                            // For Windows agents
                            bat "if not exist ${backendEnvFile} echo ${backendEnvContent} > ${backendEnvFile}"
                             // If it exists, append the line if not already present (optional)
                            bat "findstr /c:\"${backendEnvContent}\" ${backendEnvFile} >nul || echo ${backendEnvContent} >> ${backendEnvFile}"
                        }
                    }

                    // --- Process Frontend Folder ---
                    dir('client') 
                    { 
                        def frontendEnvFile = '.env'
                         if (isUnix()) 
                         {
                            // Check if .env exists in frontend, if not, create and write
                            sh "[ -f ${frontendEnvFile} ] || echo \"${frontendEnvContent}\" > ${frontendEnvFile}"
                            // If it exists, append the line if not already present 
                            sh "grep -qF \"${frontendEnvContent}\" ${frontendEnvFile} || echo \"${frontendEnvContent}\" >> ${frontendEnvFile}"
                         } 
                         else 
                         {
                            // For Windows agents
                            bat "if not exist ${frontendEnvFile} echo ${frontendEnvContent} > ${frontendEnvFile}"
                            // If it exists, append the line if not already present 
                            bat "findstr /c:\"${frontendEnvContent}\" ${frontendEnvFile} >nul || echo ${frontendEnvContent} >> ${frontendEnvFile}"
                         }
                    }
                }
            }
        }
        stage("Building the frontend and backend images")
        {
            parallel
            {
                stage("Building the Backend Image")
                {
                    steps
                    {
                        dir("server")
                        {
                            echo "Started Building Backend Image.."
                            sh "docker build -t animishsharma/firebase_blog-backend ."
                            echo "Finished Building Backend Image"
                        }
                    }
                }
                stage("Building the Frontend Image")
                {
                    steps
                    {
                            dir("client")
                            {
                                echo "Started Building Frontend Image.."
                                sh "docker build -t animishsharma/firebase_blog-frontend ."
                                echo "Finished Building Frontend Image"
                            }
                    }
                }
            }
            
        }
        stage("Running the built Images")
        {
            parallel
            {
                stage("Running Backend Container")
                {
                    steps
                    {
                        script 
                        {
                        // Use withCredentials to bind the Secret Text credentials to environment variables
                            withCredentials([
                                string(credentialsId: 'CLOUDINARY_CLOUD_NAME', variable: 'CLOUDINARY_CLOUD_NAME_VALUE'),
                                string(credentialsId: 'CLOUDINARY_API_KEY', variable: 'CLOUDINARY_API_KEY_VALUE'),
                                string(credentialsId: 'CLOUDINARY_API_SECRET', variable: 'CLOUDINARY_API_SECRET_VALUE')
                            ]) 
                            {
                                // The variables CLOUDINARY_CLOUD_NAME_VALUE, CLOUDINARY_API_KEY_VALUE,
                                // and CLOUDINARY_API_SECRET_VALUE are now available in this block.
                                
                                
                                // Remove the container if it is already running 
                                sh "docker stop backend || true"
                                sh "docker rm backend || true"
                                
                                sh """
                                    docker run --name backend -d -p 3000:3000 \\
                                    -e CLOUDINARY_CLOUD_NAME=${CLOUDINARY_CLOUD_NAME_VALUE} \\
                                    -e CLOUDINARY_API_KEY=${CLOUDINARY_API_KEY_VALUE} \\
                                    -e CLOUDINARY_API_SECRET=${CLOUDINARY_API_SECRET_VALUE} \\
                                    animishsharma/firebase_blog-backend
                                """
                                echo "Backend Container is Running !"
                            }
                        }
                    }
                }
                stage("Running Frontend Container")
                {
                    steps
                    {
                        // Remove the container if it is already running 
                        sh "docker stop frontend || true"
                        sh "docker rm frontend || true"
                        
                        sh "docker run --name frontend -d  -p 5173:5173 animishsharma/firebase_blog-frontend"
                        echo "Frontend Container is Running !"
                    }
                }
            }
        }
        // stage("Pushing the updated image to dockerHub")
        // {
        //     steps
        //     {
        //         echo "Pushing Image to DockerHub"
        //     }
        // }
        // stage("Deploying on Kubernetes")
        // {
        //     steps
        //     {
        //         echo "Deploying to K8s"
        //     }
        // }
    }
    post 
    {
        always 
        {
            echo 'Cleaning workspace, excluding specific files...'
            cleanWs()
            echo 'Workspace cleaned.'
        }
    }
}
