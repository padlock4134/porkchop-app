# Welcome to Porkchop!

Grab a seat, bub.  Let's get your mind fed -- with knowledge!

## How to run the application

> [!WARNING]
> Make sure you are in the root directory of this repository.

### 1) Install project dependencies

First, install all dependencies for the root directory, the React client application, and the NodeJS server:

```npm run install-all```

### 2) Run the application locally

For reference, the React client runs on port 3000, and the NodeJS serve runs on port 6900.

If you are doing development and debugging, run the client and server in "dev" mode. There are 2 ways to do that.

#### 2a) Run client and server concurrently from one CLI

From the root directory of this project, run the following command from the CLI:

```npm run dev```

#### 2b) Run client and server from two separate CLIs

Alternatively, if you want more granular control over which services are running, you can start React and NodeJS independently of each other.

**Client**

In one CLI, run the following to start the React dev server:

```npm run client```

**Server**

In a second separate CLI, run the following to start the NodeJS server in "dev" mode:

```npm run server```

If you want to run the server in "prod" mode, run the following command:

```npm start```

## Building the React bundle for Production

You can build the React asset bundle that will be served up by your production infrastructure NodeJS (asset bundle target location is `client/dist/`):

```npm run build```

You can remove your build directory when it is no longer needed by running the following:

```npm run clean```

## Global Tenant Signup

Now that the app is up and running, you can sign up your first user on the Signup Page at the following location:

URL: [http://{wristband_application_vanity_domain}/signup](http://{wristband_application_vanity_domain}/signup)

The value for `wristband_application_vanity_domain` can be found in your Wristband account. Navigate to your app in the Wristband Dashboard. Click on the "Application Settings" side nav menu. In the gray info box up top, you'll see the value with the label "Application Vanity Domain".

This signup page is hosted by Wristband.  Completing the signup form will provision both a new tenant with the specified tenant domain name and a new user that is assigned to that tenant.

## Global Tenant Login

User of the app can get to the Login Page via the following location in your NodeJS Server:

URL: [http://localhost:6900/api/auth/login?tenant_domain=global](http://localhost:6900/api/auth/login?tenant_domain=global).

This login page is hosted by Wristband.  Here, the user will be prompted to enter their credentials in order to login to the application.

## Dashboard Home Page

The home page for this app can be accessed at the following location:

URL: [http://localhost:6900/dashboard](http://localhost:6900/dashboard)
