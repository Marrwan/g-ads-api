## Setup Requirements for Google Ads App

### 1. Client ID and Client Secret:
   - Create a project in the [Google Cloud Console](https://console.cloud.google.com).
   - Navigate to the [OAuth 2.0 clients page](https://console.cloud.google.com/apis/credentials).
   - Create a new OAuth client ID and select "Web application" as the application type.

### 2. Redirect URI:
   - Set up a redirect URI in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials) when creating the OAuth client ID.

### 3. Developer Token:
   - Obtain a developer token from the [Google Ads API](https://developers.google.com/google-ads/api/docs/concepts/developer-token).

### 4. Project Number and Project ID:
   - Navigate to the project settings page in the [Google Cloud Console](https://console.cloud.google.com) to obtain the Project Number and Project ID.

### 5. Manager Customer ID:
   - Obtain the manager customer ID from the [Google Ads account](https://ads.google.com).

### 6. OAuth Consent Screen:
   - Configure the OAuth consent screen in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials/consent) to define how your app will present itself to users.

### 7. Scopes:
   - Ensure you add the necessary scopes required for accessing Google Ads API during the OAuth consent screen setup, such as:
     - `https://www.googleapis.com/auth/adwords`

### 8. API Library:
   - Enable the Google Ads API in the [API Library](https://console.cloud.google.com/apis/library) in the Google Cloud Console.

### 9. Service Account (Optional):
   - For server-to-server authentication, you can create a service account in the [Service Accounts page](https://console.cloud.google.com/iam-admin/serviceaccounts) and generate a key.

### 10. Environment Configuration:
   - Store your credentials securely, and configure your environment variables with the following:
     - `CLIENT_ID`
     - `CLIENT_SECRET`
     - `REDIRECT_URI`
     - `DEVELOPER_TOKEN`
     - `PROJECT_ID`
     - `PROJECT_NUMBER`
     - `MANAGER_CUSTOMER_ID`

By following these steps, you will be able to set up your Google Ads app with the required credentials and configurations.
