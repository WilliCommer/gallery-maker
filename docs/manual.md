## Gallery Maker Manual

This program is used to create photo galleries for the web. You can create multiple projects.
Each project represents a photo gallery and is saved as a single file (with the ".gmp" extension).
Access is provided via the standard "File" menu:
- New (create a new project)
- Open (open an existing file)
- Recent files
- Save
- Save As

The "Save" option is largely redundant, as changes are saved automatically. Closing the browser tab also terminates the background service. Since data is always saved, the application will restore its previous state the next time you open it.

The menu allows you to switch between the "Project," "Images," and "Gallery" views.

### Project

Here, you can specify the title of the gallery page and the name of the HTML file (the default, if no name is provided, is "index").

You can also select the destination directory where the gallery will be saved. The current project filename is displayed.

### Images

This section displays the gallery's images in a list. You can change their order and rotate the images.

Each image can be assigned a caption and an optional, more detailed description.

Use the "Add Images" menu option to include images in the list.

To make sorting easier, a "compact view" option is available in the menu.

### Gallery

When you select the "Gallery" view, the app immediately generates the finished gallery and displays a preview.

The gallery consists of a single HTML file that requires no external CSS, JavaScript, or other resources. Only the photos themselves are stored as copies in a separate folder; as a result, the HTML file and the folder can be easily published on the web or viewed locally on your computer—even without the application.