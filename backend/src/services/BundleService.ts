import BundleRepository from '../repository/BundleRepository';
import { CreateBundleBody, UpdateBundleBody } from '../bodies/bundleRequests';
import {
    BundleCreationFailureError,
    BundleNotFoundError,
} from '../errors/bundleErrors';
import ProblemRepository from '../repository/ProblemRepository';

export default class BundleService {
    private bundleRepository = new BundleRepository();

    async createBundle({ name }: CreateBundleBody, ownerId: number) {
        const newBundle = await this.bundleRepository.createBundle({
            name,
            owner: ownerId,
        });

        if (!newBundle) {
            throw new BundleCreationFailureError();
        }
    }

    async getBundleList(userId: number) {
        return await this.bundleRepository.getBundleList(userId);
    }

    async getBundle(bundleId: number) {
        const bundle = await this.bundleRepository.getBundle(bundleId);

        if (!bundle) {
            throw new BundleNotFoundError(bundleId);
        }

        return bundle;
    }

    static async getProblemsOfBundle(bundleId: number) {
        return ProblemRepository.getProblemsOfBundle(bundleId);
    }

    async updateBundle(data: UpdateBundleBody, bundleId: number) {
        const updatedBundle = this.bundleRepository.updateBundle(
            bundleId,
            data,
        );

        if (!updatedBundle) {
            throw new BundleNotFoundError(bundleId);
        }
    }

    async deleteBundle(bundleId: number) {
        await this.bundleRepository.deleteBundle(bundleId);
    }

    async addProblemsToBundle(bundleId: number, problemIds: number[]) {
        if (!(await this.bundleRepository.getBundle(bundleId))) {
            throw new BundleNotFoundError(bundleId);
        }

        await Promise.all(
            problemIds.map((id) =>
                this.bundleRepository.addProblemToBundle(bundleId, id),
            ),
        );
    }

    async removeProblemsFromBundle(bundleId: number, problemIds: number[]) {
        if (!(await this.bundleRepository.getBundle(bundleId))) {
            throw new BundleNotFoundError(bundleId);
        }

        await Promise.all(
            problemIds.map((id) =>
                this.bundleRepository.removeProblemFromBundle(bundleId, id),
            ),
        );
    }
}
