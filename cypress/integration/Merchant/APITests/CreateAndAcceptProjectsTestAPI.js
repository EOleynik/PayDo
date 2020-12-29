import projectsPage from "../../../pages/ProjectsPage";
import feenPage from "../../../pages/FeenPage";

    describe('Create and Accept Project', () => {

        it('Create and Accept Project', () => {

            projectsPage.createProject();
            projectsPage.acceptProject();
            feenPage.addProjectToMid();
        });

    });

